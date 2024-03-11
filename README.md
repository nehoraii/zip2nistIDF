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

## Conversion

### wsq -> bmp:

```sh
dwsq raw sample_image.wsq -r
convert -depth 8 -size 545x622x1 gray:sample_image.raw sample_image.bmp
```

### bmp -> wsq:

```sh
# convert sample_image.bmp -depth 8 -size 545x622x1 gray:sample_image.raw
# cwsq raw sample_image.raw -r 0.75

convert 964664644_1.bmp -depth 8 -size 800x750x1 gray:964664644_1.raw
cwsq 0.75 wsq 964664644_1.raw -raw_in 800,750,8
```