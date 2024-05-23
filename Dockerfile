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
        unzip \
        ca-certificates \
        curl \
    ;

RUN curl -fsSL https://deb.nodesource.com/setup_21.x | bash - && \
    apt-get install -y nodejs

# NBIS command line tools: cwsq, dwsq
COPY --from=build /usr/local /usr/local

# App
COPY . /opt/zip2nist
WORKDIR /opt/zip2nist

RUN useradd nist -d /home/nist -u 1000 -m
USER nist

CMD ["npm", "start"]