@echo off

:: Mở Backend (thu nhỏ)
start "Backend" /min cmd /k "npm run start"

:: Mở ngrok (thu nhỏ)
start "Ngrok" /min cmd /k "ngrok http --url=sole-pet-starfish.ngrok-free.app 3000"
