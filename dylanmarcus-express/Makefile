
s3_bucket_name = # S3 bucket?
deploy:
	aws s3 sync build/ s3://$(s3_bucket_name) --cache-control no-cache
clean:
	rm -fr build/
port = 10101
run:
	open -a 'Google Chrome' "http://localhost:$(port)"
	python3 -m http.server $(port)
