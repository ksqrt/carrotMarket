#!/bin/bash

# 이미지 빌드
docker build -t client:latest .

# 이미지 푸시
docker image push ksqrt/client:latest

kubectl delete -f deployment.yaml

kubectl apply -f deployment.yaml