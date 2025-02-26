
# TowTrace Deployment Guide

## Prerequisites

- AWS Account with appropriate permissions
- Node.js 18.x or higher
- Terraform installed locally
- GitHub account with repository access

## Initial Setup

1. **Configure AWS Credentials**
   ```bash
   aws configure
   ```

2. **Initialize Terraform**
   ```bash
   cd infrastructure
   terraform init
   ```

3. **Set up GitHub Secrets**
   Add the following secrets to your GitHub repository:
   - AWS_ACCESS_KEY_ID
   - AWS_SECRET_ACCESS_KEY
   - AWS_S3_BUCKET
   - AWS_CLOUDFRONT_ID

## Deployment Process

### Manual Deployment

1. **Build the Application**
   ```bash
   npm install
   npm run build
   ```

2. **Deploy Infrastructure**
   ```bash
   cd infrastructure
   terraform apply
   ```

3. **Deploy Application**
   ```bash
   aws s3 sync dist/ s3://towtrace-prod-website
   ```

### Automated Deployment

The CI/CD pipeline will automatically:
1. Build and test the application
2. Deploy to AWS on merge to main branch
3. Invalidate CloudFront cache

## Monitoring

1. **Application Monitoring**
   - CloudWatch Metrics
   - Error Tracking
   - Performance Monitoring

2. **Infrastructure Monitoring**
   - AWS CloudWatch
   - S3 Access Logs
   - CloudFront Logs

## Rollback Procedure

1. **Application Rollback**
   ```bash
   aws s3 cp s3://towtrace-prod-website-backup/ s3://towtrace-prod-website/ --recursive
   ```

2. **Infrastructure Rollback**
   ```bash
   terraform plan -destroy
   terraform destroy
   ```

## Security Considerations

- Enable AWS WAF for CloudFront
- Implement proper IAM roles and policies
- Regular security audits
- Enable bucket versioning for rollbacks

## Troubleshooting

Common issues and their solutions:
1. **Build Failures**
   - Check Node.js version
   - Verify dependencies

2. **Deployment Failures**
   - Verify AWS credentials
   - Check S3 bucket permissions
   - Validate CloudFront settings

