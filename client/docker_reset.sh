#!/bin/bash

# 도커 서비스 중지
sudo systemctl stop docker

# 도커 데이터 삭제
sudo rm -rf /var/lib/docker

# 도커 구성 파일 및 스크립트 삭제 (선택적)
sudo rm -rf /etc/docker

# 도커 실행 스크립트 제거 (선택적)
sudo rm /usr/local/bin/docker-compose
sudo rm /usr/local/bin/docker-machine
sudo rm /usr/local/bin/docker-credential-*

# 도커 재설치
sudo apt update
sudo apt remove docker docker-engine docker.io containerd runc
sudo apt install apt-transport-https ca-certificates curl gnupg lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io

# 도커 그룹에 사용자 추가 (옵션)
sudo usermod -aG docker $USER

# 도커 서비스 시작
sudo systemctl start docker

# 도커 서비스 자동 시작 설정
sudo systemctl enable docker
