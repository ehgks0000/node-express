# 기초적인 Node js Back-end!

## 기술 스택

Arcitechture : node.js && Express.js  
DB : MongoDB(& mongoose)

## 라이브러리

- passport를 이용한 SNS로그인(google, naver)
- morgan && winstons를 이용한 log 저장
- bcrypt를 이용한 패스워드 해쉬화
- jwt의 토큰을 이용한 회원가입, 로그인, 비밀번호 초기화, 회원 인증
- nodemailer을 이용한 Gmail 이메일 발송
- multer를 이용한 이미지 업로드 && sharp를 이용한 이미지 크롭

## 주요 기능 (Router)

### Users.js

post 로그인 : http://localhost:1337/users/login

get google 로그인 : http://localhost:1337/auth/google/

get naver 로그인 : http://localhost:1337/auth/naver/

get 로그아웃 : http://localhost:1337/users/logout

get 전체 로그아웃 : http://localhost:1337/users/logoutAll

post 회원가입 : localhost:1337/users

get 회원가입 인증 메일 발송 : http://localhost:1337/users/certify/:token

del 회원 탈퇴 : localhost:1337/users/

del 회원 삭제(관리자가) : localhost:1337/users/search/:userId

get auth 확인 : http://localhost:1337/auth

patch 회원 수정 : http://localhost:1337/users/

get 전체회원 검색 : localhost:1337/users

get 특정 회원 검색 : localhost:1337/users/search/:userId

post 아이디(이메일) 찾기 : localhost:1337/users/finding

post 패스워드 초기화 메일 발송 : http://localhost:1337/users/reset

get 회원 패스워드 수정 : http://localhost:1337/users/modify/

post 회원 비밀번호 수정(관리자가) : http://localhost:1337/users/reset/:token

patch 회원 정보 수정(관리자가, 패스워드 제외한) : localhost:1337/users/search/:userId

post 회원 아바타 이미지 업로드 : localhost:1337/users/uploadImg

delte 이미지 삭제 : localhost:1337/users/uploadImg

get 회원 이미지 보기 : localhost:1337/users/:id/avatar

### Memos.js

post 메모 작성 : {{url}}/memos

get 전체 메모 보기 : {{url}}/memos

delete 메모 삭제 : {{url}}/memos/:memoId
