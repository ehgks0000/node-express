# 기초적인 Node js Back-end!

- https://node-express-tutorials.herokuapp.com
- http://api.expresstest.ml:80
- https://expresstest.ml:443

---

## Setting

1. npm i
2. root/config 폴더에 config.env 파일 생성
3.
4. npm run dev
5. npm start(build 후 pm2 start)

## 기술 스택

> Arcitechture : node.js && Express.js  
> DB : MongoDB (mongoose)  
> Server : AWS EC2 Ubuntu 20.04

## 라이브러리

- passport를 이용한 SNS로그인(google, naver)
- morgan && winstons를 이용한 log 저장
- bcrypt를 이용한 패스워드 해쉬화
- jwt의 토큰을 이용한 회원가입, 로그인, 비밀번호 초기화, 회원 인증
- nodemailer을 이용한 Gmail 이메일 발송
- multer를 이용한 이미지 업로드 && sharp를 이용한 이미지 크롭
- pm2(process manager)로 CI/CD
- iptable && iptable-persistents로로 예상치 못한 서버 종료시 자동시작

## 주요 기능 (Router)

### Users.js

- post 로그인 : {{url}}/users/login

- get google 로그인 : {{url}}/auth/google/

- get naver 로그인 : {{url}}/auth/naver/

- get 로그아웃 : {{url}}/users/logout

- get 전체 로그아웃 : {{url}}/users/logoutAll

- post 회원가입 : {{url}}/users

- get 회원가입 인증 메일 발송 : {{url}}/users/certify/:token

- del 회원 탈퇴 : {{url}}/users/

- del 회원 삭제(관리자가) : {{url}}/users/search/:userId

- <del> get auth 확인 : {{url}}/auth

- get 내 프로필 확인 : {{url}}/users/me

- patch 회원 수정 : {{url}}/users/

- get 전체회원 검색 : {{url}}/users

- get 특정 회원 검색 : {{url}}/users/search/:userId

- post 아이디(이메일) 찾기 : {{url}}/users/finding

- post 패스워드 초기화 메일 발송 : {{url}}/users/reset

- get 회원 패스워드 수정 : {{url}}/users/modify/

- post 회원 비밀번호 수정(관리자가) : {{url}}/users/reset/:token

- patch 회원 정보 수정(관리자가, 패스워드 제외한) : {{url}}/users/search/:userId

- post 회원 아바타 이미지 업로드 : {{url}}/users/uploadImg

- delte 이미지 삭제 : {{url}}/users/uploadImg

- get 회원 이미지 보기 : {{url}}/users/:id/avatar

### Memos.js

- post 메모 작성 : {{url}}/memos

- get 내 전체 메모 보기 : {{url}}/memos

- delete 메모 삭제 by ID : {{url}}/memos/:memoId

- get 메모 찾기 by ID : {{url}}/memos/:memoId

patch 메모 수정 by ID : {{url}}/memos/:memoId

## 배포

### Heroku 완료

- https://node-express-tutorials.herokuapp.com

## AWS ec2 완료

- http://api.expresstest.ml

> freenom의 무료 도메인 할당 및 네임서버 연결  
> AWS Route 53 도메인 연결

- https://expresstest.ml //https 프로토콜

> SSL/TLS AWS Certiticate Manager(ACM)에서 인증서 발급  
> EC2 Elastic Load Balancing 및 AWS Route 53 도메인 연결  
> ELB로 80포트 443포트로 리디렉션
