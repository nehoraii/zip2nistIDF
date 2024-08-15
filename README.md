# zip2nist

This service converts a ZIP file containing BMP fingeprints and associated metadata (see example in [data/964664644.zip](data/964664644.zip)) to the standard NIST-ITL ("TDF") format.

It can be run from the command line to convert a local file:

    $ npm install
    $ ./src/main.ts data/964664644.zip

The associated Dockerfile runs as a web service, which can be accessed as follows:

    $ curl -v -H 'content-type: application/zip/bmp' localhost:3000/zip2nist --data-binary @data/data/964664644.zip -o 964664644.tdf

## Workspace setup

Zip2Nist relies on the [nbis](https://github.com/DigitalIDF/nbis) submodule in order to run. When cloning the repository, ensure cloning of submodules as well:
    $ git clone --recurse-submodules https://github.com/DigitalIDF/zip2nist.git

(Older versions of git may require [different syntax](https://stackoverflow.com/questions/1030169/pull-latest-changes-for-all-git-submodules))

### Troubleshooting

If you encounter this error while building the Docker image:
```bin
 => ERROR [build 3/6] RUN ./setup.sh /usr/local --STDLIBS --without-X11                                                                                         0.3s 
------
 > [build 3/6] RUN ./setup.sh /usr/local --STDLIBS --without-X11:
0.241 /bin/sh: 1: ./setup.sh: not found
```

You can resolve it by changing the file format of the `setup.sh` script in nbis. 
1. Open WSL Ubuntu or any other distro that contains Vim
2. Open the script in vim: `vim setup.sh`
3. Enter command mode in vim `shift + :`
4. Type the command: `set fileformat=unix`
5. Exit with save: `:wq`

## Dependencies

- Handling the NIST-ITL format is done with the help of [node-nist](https://github.com/ivosh/node-nist).
- Conversion of images between BMP and WSQ is done with the help of [ImageMagick](https://imagemagick.org)'s `convert` tool and the [NBIS](https://www.nist.gov/services-resources/software/nist-biometric-image-software-nbis) command line tools `cwsq` and `dwsq`.


## References

The Information Technology Laboratory (ITL) of the National Institute of Standards and Technology (NIST):

- ANSI/NIST-ITL 1-2011 Update:2015
- NIST-ITL format: http://dx.doi.org/10.6028/NIST.SP.500-290e3
- https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.500-290e3.pdf


Structure:

- Transaction:
    - Records:
        Type-1 (mandatory): Transaction information
        Type-2: User-defined descriptive text
        Type-13: Variable-resolution latent friction ridge image
        - Fields:
            Number, description, mnemonic
