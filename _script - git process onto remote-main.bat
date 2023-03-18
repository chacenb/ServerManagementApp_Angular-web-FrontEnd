@echo off
echo ########################################
cd %CD%
echo # Running %~nx0
echo ########################################
echo #  GIT LAST 3 LOGS - CHACE ANGULAR APP #
echo ########################################
echo.
git log -n 3
echo.
echo ^>^>^> Next step : git status ...
pause >nul 
echo.
echo.
echo.
echo ########################################
echo # ... GIT STATUS - CHACE ANGULAR APP ###
echo ########################################
echo.
git status
echo.
echo ^>^>^> Next step : Adding all files and commit...
pause >nul 
echo.
echo.
echo.
echo ########################################
echo # ADD ALL + COMMIT - CHACE ANGULAR APP #
echo ########################################
echo.
git add .
echo all files added to the next commit ...
set /p GIT_COMMIT_DESC="Type in the commit description : " 	@REM Request user input (inline string)
git commit -m "%GIT_COMMIT_DESC%"
echo Committed successfully!
echo.
echo Here is the last commit made ...
timeout /t 2 >nul
echo.
git log -n 1
echo.

set /p PUSH_OR_NOT="Do you want to push your work to origin (y/n)? : " 	@REM Request user input (inline string)

if "%PUSH_OR_NOT%"=="y" (
	echo.
    	echo ########################################
	echo ######## PUSHING TO ORIGIN #############
	echo ########################################
	echo.
	@REM set /p BRANCH_TO_PUSH="Branch to push : "
	@REM echo Starting to push ...	
	@REM git push -u origin %BRANCH_TO_PUSH%
	git push
	echo.
	echo New status ...
	echo.
	timeout /t 2 >nul
	git status	
)

echo.
echo Press any key to exit ...
@REM pause >nul 
timeout /t 3






@REM ---- COMMENTS ---------------------------------------------
@REM color A
@REM pause >nul 	| pauses the console. >nul avoids prompting the default message of a cmd "Press any key to continue . . ."
@REM cmd /k
@REM timeout /t 10
@REM "echo." Adds a blank line 