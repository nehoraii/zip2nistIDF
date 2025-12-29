FROM ubuntu:20.04 AS dev

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    git \
    clangd-12 \
    ;

RUN update-alternatives --install /usr/bin/clangd clangd /usr/bin/clangd-12 100

# #####################################################
FROM dev AS build

COPY nbis/ /src/
WORKDIR /src

RUN chmod +x ./setup.sh
RUN sed -i 's/\r$//' ./setup.sh
RUN ./setup.sh /usr/local --STDLIBS --without-X11

RUN make config
RUN make it
RUN make install LIBNBIS=no

# #####################################################
FROM ubuntu:20.04 AS deploy

RUN apt-get update;

RUN apt-get install -y --no-install-recommends curl \
    ca-certificates \
    man \
    imagemagick \
    unzip;

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get update
RUN apt-get install -y nodejs

# NBIS command line tools: cwsq, dwsq
COPY --from=build /usr/local /usr/local

# App
COPY . /opt/zip2nist
WORKDIR /opt/zip2nist
RUN npm install
RUN npm i -g ts-node
# RUN useradd nist -d /home/nist -u 1000 -m
# USER root

EXPOSE 80 3000
# ENV NLS_LANG=HEBREW_ISRAEL.IW8MSWIN1255
CMD ["ts-node", "src/index.ts"]
# ENTRYPOINT ["tail", "-f", "/dev/null"]
