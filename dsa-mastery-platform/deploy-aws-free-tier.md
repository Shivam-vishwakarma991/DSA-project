# AWS Free Tier Deployment Guide for DSA Mastery Platform

## Prerequisites
- AWS Account (Free Tier eligible)
- Docker installed locally
- Git installed
- Basic knowledge of AWS services

## Step 1: AWS Account Setup

### 1.1 Create AWS Account
1. Go to [AWS Console](https://aws.amazon.com/)
2. Click "Create an AWS Account"
3. Follow the registration process
4. **Important**: Use a credit card for verification (you won't be charged if you stay within free tier limits)

### 1.2 Set Up IAM User
1. Go to IAM Console
2. Create a new IAM user with programmatic access
3. Attach `AdministratorAccess` policy (for simplicity)
4. Save the Access Key ID and Secret Access Key

## Step 2: Install AWS CLI and Configure

### 2.1 Install AWS CLI
```bash
# macOS
brew install awscli

# Or download from AWS website
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /
```

### 2.2 Configure AWS CLI
```bash
aws configure
# Enter your Access Key ID
# Enter your Secret Access Key
# Enter your region (e.g., us-east-1)
# Enter output format (json)
```

## Step 3: Set Up AWS Services (Free Tier)

### 3.1 Create S3 Bucket for Environment Variables
```bash
aws s3 mb s3://dsa-mastery-env-vars
```

### 3.2 Create Parameter Store for Secrets
```bash
# Create JWT secret
aws ssm put-parameter \
    --name "/dsa-mastery/jwt-secret" \
    --value "your-super-secret-jwt-key-here" \
    --type "SecureString"

# Create MongoDB password
aws ssm put-parameter \
    --name "/dsa-mastery/mongo-password" \
    --value "your-secure-mongo-password" \
    --type "SecureString"
```

### 3.3 Set Up MongoDB Atlas (Free Tier)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account
3. Create a new cluster (M0 - Free tier)
4. Create database user
5. Get connection string
6. Update your environment variables

## Step 4: Prepare Application for Deployment

### 4.1 Create Environment File
```bash
cp env.example .env
```

### 4.2 Update Environment Variables
Edit `.env` file with your actual values:
```bash
# Use MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dsa_mastery

# Use AWS Parameter Store values
JWT_SECRET=your-super-secret-jwt-key-here
MONGO_PASSWORD=your-secure-mongo-password

# Update CORS for your domain
CORS_ORIGIN=https://your-app-domain.com
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

### 4.3 Test Docker Build Locally
```bash
# Build and test locally
docker-compose up --build

# Test the application
curl http://localhost:3000
curl http://localhost:5000/api/health
```

## Step 5: Deploy to AWS Free Tier Services

### Option A: AWS App Runner (Recommended for Free Tier)

#### 5.1 Create ECR Repository
```bash
# Create repository for frontend
aws ecr create-repository --repository-name dsa-mastery-frontend

# Create repository for backend
aws ecr create-repository --repository-name dsa-mastery-backend
```

#### 5.2 Build and Push Docker Images
```bash
# Get ECR login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Build and tag images
docker build -t dsa-mastery-frontend .
docker build -f Dockerfile.backend -t dsa-mastery-backend .

# Tag for ECR
docker tag dsa-mastery-frontend:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/dsa-mastery-frontend:latest
docker tag dsa-mastery-backend:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/dsa-mastery-backend:latest

# Push to ECR
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/dsa-mastery-frontend:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/dsa-mastery-backend:latest
```

#### 5.3 Deploy with App Runner
1. Go to AWS App Runner Console
2. Create service for backend:
   - Source: Container registry
   - Provider: Amazon ECR
   - Image: dsa-mastery-backend:latest
   - Port: 5000
   - Environment variables: Add all from .env file

3. Create service for frontend:
   - Source: Container registry
   - Provider: Amazon ECR
   - Image: dsa-mastery-frontend:latest
   - Port: 3000
   - Environment variables: Add frontend variables

### Option B: AWS Elastic Beanstalk (Alternative)

#### 5.1 Install EB CLI
```bash
pip install awsebcli
```

#### 5.2 Initialize EB Application
```bash
eb init dsa-mastery-platform
eb create dsa-mastery-production --instance-type t2.micro
```

#### 5.3 Deploy
```bash
eb deploy
```

## Step 6: Set Up Domain and SSL (Optional)

### 6.1 Register Domain (if needed)
- Use Route 53 or external registrar
- Point to your App Runner/EB endpoints

### 6.2 Set Up SSL Certificate
- Use AWS Certificate Manager (free)
- Request certificate for your domain
- Attach to your App Runner services

## Step 7: Monitoring and Maintenance

### 7.1 Set Up CloudWatch Alarms
```bash
# Create basic monitoring
aws cloudwatch put-metric-alarm \
    --alarm-name "dsa-mastery-cpu-high" \
    --alarm-description "CPU utilization is high" \
    --metric-name "CPUUtilization" \
    --namespace "AWS/EC2" \
    --statistic "Average" \
    --period 300 \
    --threshold 80 \
    --comparison-operator "GreaterThanThreshold"
```

### 7.2 Set Up Logging
- Enable CloudWatch logs in App Runner
- Monitor application logs for errors

## Step 8: Cost Optimization for Free Tier

### 8.1 Monitor Usage
- Set up AWS Budgets alerts
- Monitor free tier usage in AWS Console

### 8.2 Optimize Resources
- Use t2.micro instances (free tier eligible)
- Enable auto-scaling with minimum 0 instances
- Use S3 for static assets
- Implement caching strategies

## Step 9: Backup and Recovery

### 9.1 Database Backup
- MongoDB Atlas provides automatic backups
- Set up manual backup scripts if needed

### 9.2 Application Backup
- Store Docker images in ECR
- Use Git for code version control
- Backup environment variables securely

## Troubleshooting

### Common Issues:
1. **Port conflicts**: Ensure ports 3000 and 5000 are available
2. **Environment variables**: Double-check all variables are set correctly
3. **CORS errors**: Update CORS_ORIGIN with your actual domain
4. **Database connection**: Verify MongoDB Atlas network access

### Useful Commands:
```bash
# Check container logs
docker-compose logs

# SSH into EC2 instance (if using EB)
eb ssh

# Check AWS service status
aws health describe-events

# Monitor costs
aws ce get-cost-and-usage --time-period Start=2024-01-01,End=2024-01-31 --granularity MONTHLY --metrics BlendedCost
```

## Free Tier Limits to Watch:
- **EC2**: 750 hours/month of t2.micro
- **S3**: 5GB storage
- **Data Transfer**: 15GB outbound
- **App Runner**: 750 hours/month
- **ECR**: 500MB storage

## Next Steps:
1. Set up CI/CD pipeline with GitHub Actions
2. Implement monitoring and alerting
3. Add CDN for static assets
4. Set up automated backups
5. Implement security best practices

Remember to monitor your AWS usage regularly to stay within free tier limits!
