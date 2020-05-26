# Please Websites

This is a git hosted directory, all files within the "creation-files/" folder of each website folder will be ignored from git to reduce clutter.

## TIER 1 WEBSITE LIST
- meatgravy
  - update bg video framework
  - add analytics
  - design gravy boat logo (brendan)
- fuckingsarkis
  - update bg video framework
- genesname
  - update bg video framework
  - add analytics
- philorpeter
  - format for desktop
  - add analytics
- frenchfryangle
- parallelograndma
- parallelogrammy
- texmexagons
  - add analytics
  - format bg image nicely
- mexagons
  - add analytics
  - format bg image nicely
- auntcolony
  - add analytics
  - finish js
  - format
- heatedmammories
  - edit together content (brendan)
- chaffedorgangster
  - edit together content (brendan)
- toomuchspaghetti
  - edit together content (brendan)
- notenoughspaghetti
  - edit together content (brendan)
- teenagemutantninjahurdles
  - add analytics
  - format bg image nicely
- menacingminstrel
  - add analytics
  - finish js
  - format
- praisecod
  - edit together content (brendan)

## Instructions for Hosting on AWS
 - create bucket with format: please-[website-domain]-public
 - turn off all `Permissions>Block Public Access`
 - add new `Permissions>Bucket Policy`
 ```
 {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicRead",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::please-[website-domain]-public/*"
        }
    ]
}
```
 - turn on `Static website hosting`
 - create Hosted Zone in `Route 53` with name of domain
 - add nameservers from `Route 53` to domain handler (Godaddy) for that domain
 - create certificate in `Certificate Manager` with name of domain
 - validate domain via `Domain>Create record in Route 53` function
 - make a new `CloudFront Distribution` with the `Origin Domain Name` = URL from `Static website hosting`, `Redirect HTTP to HTTPS`, `Alternate Domain Names (CNAMEs)` = [website-domain], `Custom SSL Certificate` = certificate from `Certificate Manager`
 - add new `alias` record to domain on `Route 53` with the target link pointing to the `CloudFront Distribution URL` 
 - test it!