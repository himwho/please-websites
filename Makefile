#  = please Deployment Management
AUNTCOLONY = please-auntcolony.com-public
FUCKINGSARKIS = please-fuckingsarkis.com-public
PARALLELOGRANDMA = please-parallelograndma.com-public
GENESNAME = please-genesname.com-public
PHILORPETER = please-philorpeter.com-public
IOS8POEMS = please-ios8poems.com-public
PLEASEWEBSITE = please-pleasewebsite.com-public
JACKNPHILFOODREVIEWS = please-jacknphilfood.reviews
STRIPPERFARTS = please-stripperfarts.com-public
MEATGRAVY = please-meatgravy.com-public
TMNH = please-teenagemutantninjahurdles.com-public
MENACINGMINSTREL = please-menacingminstrel.com-public
TEXMEGAONS = please-texmexagons.com-public
FLAMDANGOS = please-flamdangos.com-public
MEXAGONS = please-mexagons.com-public
TOMSACHSOPHONE = please-tomsachsophone.com-public
FRENCHFRYANGLE = please-frenchfryangle.com-public
PARALLELOGRAMMY = please-parallelogrammy.com-public
CHAFFEDORGANGSTER = please-chafedorgagnster.com-public
PRAISECOD = please-praisecod.life-public

# getting OS type
ifeq ($(OS),Windows_NT)
	detected_OS := Windows
else
	detected_OS := $(shell uname)
endif

install: 
	# install all deps

auntcolony:
	aws s3 sync auntcolony.com/  s3://$(AUNTCOLONY) --cache-control no-cache --profile personal

fuckingsarkis:
	aws s3 sync fuckingsarkis.com/ s3://$(FUCKINGSARKIS) --cache-control no-cache --profile personal

parallelograndma:
	aws s3 sync parallelograndma.com/  s3://$(PARALLELOGRANDMA) --cache-control no-cache --profile personal

genesname:
	aws s3 sync genesname.com/ s3://$(GENESNAME) --cache-control no-cache --profile personal

philorpeter:
	aws s3 sync philorpeter.com/  s3://$(PHILORPETER) --cache-control no-cache --profile personal

ios8poems:
	aws s3 sync ios8poems.com/ s3://$(IOS8POEMS) --cache-control no-cache --profile personal

pleasewebsite:
	aws s3 sync pleasewebsite.com/  s3://$(PLEASEWEBSITE) --cache-control no-cache --profile personal

jacknphilfood:
	aws s3 sync jacknphilfood.com/ s3://$(JACKNPHILFOODREVIEWS) --cache-control no-cache --profile personal

stripperfarts:
	aws s3 sync stripperfarts.com/  s3://$(STRIPPERFARTS) --cache-control no-cache --profile personal

meatgravy:
	aws s3 sync meatgravy.com/ s3://$(MEATGRAVY) --cache-control no-cache --profile personal

teenagemutantninjahurdles:
	aws s3 sync teenagemutantninjahurdles.com/  s3://$(TMNH) --cache-control no-cache --profile personal

menacingminstrel:
	aws s3 sync menacingminstrel.com/ s3://$(MENACINGMINSTREL) --cache-control no-cache --profile personal

texmexagons:
	aws s3 sync texmexagons.com/  s3://$(TEXMEGAONS) --cache-control no-cache --profile personal

flamdangos:
	aws s3 sync flamdangos.com/ s3://$(FLAMDANGOS) --cache-control no-cache --profile personal

mexagons:
	aws s3 sync mexagons.com/  s3://$(MEXAGONS) --cache-control no-cache --profile personal

tomsachsophone:
	aws s3 sync tomsachsophone.com/ s3://$(TOMSACHSOPHONE) --cache-control no-cache --profile personal

frenchfryangle:
	aws s3 sync frenchfryangle.com/  s3://$(FRENCHFRYANGLE) --cache-control no-cache --profile personal

parallelogrammy:
	aws s3 sync parallelogrammy.com/ s3://$(PARALLELOGRAMMY) --cache-control no-cache --profile personal

chaffedorgangster:
	aws s3 sync chaffedorgangster.com/ s3://$(CHAFFEDORGANGSTER) --cache-control no-cache --profile personal

praisecod:
	aws s3 sync praisecod.life/ s3://$(PRAISECOD) --cache-control no-cache --profile personal