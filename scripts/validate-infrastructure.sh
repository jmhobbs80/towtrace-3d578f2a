
#!/bin/bash

# Check AWS Configuration
echo "Checking AWS Configuration..."
aws configure list

# Validate Terraform Configuration
echo "Validating Terraform Configuration..."
cd infrastructure
terraform validate

# Check S3 Bucket Access
echo "Checking S3 Bucket Access..."
aws s3 ls s3://towtrace-prod-website

# Verify CloudFront Distribution
echo "Checking CloudFront Distribution..."
aws cloudfront list-distributions

# Check GitHub Actions
echo "Verifying GitHub Actions Configuration..."
if [ -f ".github/workflows/main.yml" ]; then
    echo "GitHub Actions configuration found"
else
    echo "Error: GitHub Actions configuration missing"
fi

