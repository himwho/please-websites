#  = please Deployment Management
PLEASE = please-please.nyc-public
AUNTCOLONY = please-auntcolony.com-public
FUCKINGSARKIS = please-fuckingsarkis.com-public
PARALLELOGRANDMA = please-parallelograndma.com-public
GENESNAME = please-genesname.com-public
PHILORPETER = please-philorpeter.com-public
IOS8POEMS = please-ios8poems.com-public
PLEASEWEBSITE = please-pleasewebsite.com-public
JACKNPHILFOODREVIEWS = please-jacknphilfood.reviews
STRIPPERFARTS = please-stripperfarts.com-public
MEATGRAVY = please-meatgravy.club-public
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
DDIY = please-ddiy.pro-public
STRIPPERBOAT = please-strippersonaboat.com-public
PATRICK = please-patricksneedforspeed.com-public

# getting OS type
ifeq ($(OS),Windows_NT)
	detected_OS := Windows
else
	detected_OS := $(shell uname)
endif

install: 
	# install all deps

all: auntcolony fuckingsarkis parallelogrammy parallelograndma genesname philorpeter ios8poems stripperfarts meatgravy teenagemutantninjahurdles menacingminstrel texmexagons flamdangos mexagons tomsachsophone frenchfryangle chaffedorgangster praisecod

please:
	aws s3 sync please.nyc/  s3://$(PLEASE) --cache-control no-cache --exclude '.DS_Store' --profile personal

auntcolony:
	aws s3 sync auntcolony.com/  s3://$(AUNTCOLONY) --cache-control no-cache --exclude '.DS_Store' --profile personal

fuckingsarkis:
	aws s3 sync fuckingsarkis.com/ s3://$(FUCKINGSARKIS) --cache-control no-cache --exclude '.DS_Store' --profile personal

parallelograndma:
	aws s3 sync parallelograndma.com/  s3://$(PARALLELOGRANDMA) --cache-control no-cache --exclude '.DS_Store' --profile personal

genesname:
	aws s3 sync genesname.com/ s3://$(GENESNAME) --cache-control no-cache --exclude '.DS_Store' --profile personal

philorpeter:
	aws s3 sync philorpeter.com/  s3://$(PHILORPETER) --cache-control no-cache --exclude '.DS_Store' --profile personal

ios8poems:
	aws s3 sync ios8poems.com/ s3://$(IOS8POEMS) --cache-control no-cache --exclude '.DS_Store' --profile personal

pleasewebsite:
	aws s3 sync pleasewebsite.com/  s3://$(PLEASEWEBSITE) --cache-control no-cache --exclude '.DS_Store' --profile personal

jacknphilfood:
	aws s3 sync jacknphilfood.com/ s3://$(JACKNPHILFOODREVIEWS) --cache-control no-cache --exclude '.DS_Store' --profile personal

stripperfarts:
	aws s3 sync stripperfarts.com/  s3://$(STRIPPERFARTS) --cache-control no-cache --exclude '.DS_Store' --profile personal

meatgravy:
	aws s3 sync meatgravy.club/ s3://$(MEATGRAVY) --cache-control no-cache --exclude '.DS_Store' --profile personal

teenagemutantninjahurdles:
	aws s3 sync teenagemutantninjahurdles.com/  s3://$(TMNH) --cache-control no-cache --exclude '.DS_Store' --profile personal

menacingminstrel:
	aws s3 sync menacingminstrel.com/ s3://$(MENACINGMINSTREL) --cache-control no-cache --exclude '.DS_Store' --profile personal

texmexagons:
	aws s3 sync texmexagons.com/  s3://$(TEXMEGAONS) --cache-control no-cache --exclude '.DS_Store' --profile personal

flamdangos:
	aws s3 sync flamdangos.com/ s3://$(FLAMDANGOS) --cache-control no-cache --exclude '.DS_Store' --profile personal

mexagons:
	aws s3 sync mexagons.com/  s3://$(MEXAGONS) --cache-control no-cache --exclude '.DS_Store' --profile personal

tomsachsophone:
	aws s3 sync tomsachsophone.com/ s3://$(TOMSACHSOPHONE) --cache-control no-cache --exclude '.DS_Store' --profile personal

frenchfryangle:
	aws s3 sync frenchfryangle.com/  s3://$(FRENCHFRYANGLE) --cache-control no-cache --exclude '.DS_Store' --profile personal

parallelogrammy:
	aws s3 sync parallelogrammy.com/ s3://$(PARALLELOGRAMMY) --cache-control no-cache --exclude '.DS_Store' --profile personal

chaffedorgangster:
	aws s3 sync chaffedorgangster.com/ s3://$(CHAFFEDORGANGSTER) --cache-control no-cache --exclude '.DS_Store' --profile personal

praisecod:
	aws s3 sync praisecod.life/ s3://$(PRAISECOD) --cache-control no-cache --exclude '.DS_Store' --profile personal

ddiy:
	aws s3 sync ddiy.pro/ s3://$(DDIY) --cache-control no-cache --exclude '.DS_Store' --profile personal

strippersonaboat:
	aws s3 sync strippersonaboat.com/ s3://$(STRIPPERBOAT) --cache-control no-cache --exclude '.DS_Store' --profile personal

patrick:
	aws s3 sync patricksneedforspeed.com/ s3://$(PATRICK) --cache-control no-cache --exclude '.DS_Store' --profile personal

