FROM ubuntu:20.04 AS dev

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        git \
        clangd-12 \
    ;

RUN update-alternatives --install /usr/bin/clangd clangd /usr/bin/clangd-12 100


#####################################################
FROM dev AS build

COPY nbis/ /src

WORKDIR /src
RUN ./setup.sh /usr/local --STDLIBS --without-X11

RUN make config
RUN make it
RUN make install LIBNBIS=no


#####################################################
FROM ubuntu:20.04 as deploy

RUN apt-get update;

RUN apt-get install -y --no-install-recommends \
        man \
        imagemagick \
        ca-certificates \
        curl \
    ;

RUN curl -fsSL   https://deb.nodesource.com/setup_21.x | bash - && \
    apt-get install -y nodejs

COPY --from=build /usr/local /usr/local
