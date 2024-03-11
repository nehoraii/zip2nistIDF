# FROM --platform=linux/amd64 ubuntu:20.04 AS dev
FROM ubuntu:20.04 AS dev
RUN apt-get update && apt-get install -y build-essential git clangd-12
RUN update-alternatives --install /usr/bin/clangd clangd /usr/bin/clangd-12 100


FROM dev AS build
COPY nist/ /src
RUN mkdir /opt/nist
WORKDIR /src
RUN ./setup.sh /opt/nist --STDLIBS --without-X11 --64
RUN make config
RUN make it
RUN make install LIBNBIS=no


FROM ubuntu:20.04
RUN apt-get update && apt-get install -y man
COPY --from=build /opt/nist /opt/nist
