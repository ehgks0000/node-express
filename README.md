# 기초적인 Node js Back-end!

## 기술 스택

Arcitechture : node.js && Express.js  
DB : MongoDB(& mongoose)

## 라이브러리

-   bcrypt를 이용한 패스워드 해쉬화
-   jwt의 토큰을 이용한 회원가입, 로그인, 비밀번호 초기화, 회원 인증
-   nodemailer을 이용한 Gmail 이메일 발송

## 주요 기능 (Router)

post 로그인 : http://localhost:1337/users/login

get 로그아웃 : http://localhost:1337/users/logout

post 회원가입 : localhost:1337/users

get 회원가입 인증 메일 발송 : http://localhost:1337/users/certify/eyJhbGciOiJIUzI1NiJ9.NWZiOTQ5ZmE4YzMyYTY3Y2QwMDU1YTY1.w7Kl9gv4l3PDbkminLcyfJxpLhCG88nAYUxY9Nls6f4

del 회원 탈퇴 : localhost:1337/users/

get auth 확인 : http://localhost:1337/auth

patch 회원 수정 : http://localhost:1337/users/

get 전체회원 검색 : localhost:1337/users

get 특정 회원 검색 : localhost:1337/users/search/5fb4d5d6bc11aa28902d8210

post 패스워드 초기화 메일 발송 : http://localhost:1337/users/reset

get 회원 패스워드 수정 : http://localhost:1337/users/modify/

post 회원 비밀번호 수정(관리자가) : http://localhost:1337/users/reset/eyJhbGciOiJIUzI1NiJ9.NWZiOGFlMmI3MzEwZTA2ZmYwNmIxNDAz.M9jPvvsHa824Cg7P6Yh2lXf44w7riTK6Nivfp0PkV40

del 회원 삭제(관리자가) : localhost:1337/users/search/5fb4d4093709923e14b353df

patch 회원 정보 수정(관리자가, 패스워드 제외한) : localhost:1337/users/search/5fb4d5d6bc11aa28902d8210
