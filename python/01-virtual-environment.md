---
title: The Virtual Environment
videoId: PZB_fFYjvj8
slug: virtual-environment
---

The virtual environment is a sandbox for your Python projects. It allows you to install an exact version of Python and all your project's packages in a specific folder. This way each of your projects is it's own sandbox with its own Python version. Additionally, you can maintain a list of packages and their versions specific to this project. 

This has several benefits. You can for example make sure that the same version of Python and all packages is used on your development environment as well as on a server. It also helps working with other team members who should use the same versions as you do. 

## Install Python 3

First, you need to make sure Python 3 is installed. You can confirm that by typing `python3 --version` in your command line. 

On Windows, you can install it through the microsoft app store. 

On Mac, it should be pre-installed already.

On Linux, you can run the following commands to install it: 

```
sudo apt-get update

sudo apt-get install python3
```

## Create a virtual environment

To create a virtual environment in Python just navigate to your project directory in the command line. Then enter:

```python
python3 -m venv venv
```

You need to write `python3` because the virtual environment is a new feature of Python 3. `-m` is a flag that says you are about to try and execute a specific Python module ([more details here](https://docs.python.org/3/using/cmdline.html#cmdoption-m)). The first `venv` is the name of the Python module that's in charge of creating the virtual environment. So with `python3 -m venv` we're executing that specific module. Lastly, we need to give the environment folder a name. This could be anything like "house" or "bananas". The Python community most commonly uses "venv" as folder name. That's why we use it here as well. 

When you run the command you'll see a new "venv" folder in your project. That folder contains Python itself and all the packages installed in your project. 

## Activate the virtual environment

To activate the environment you need to run a script within the folder you just created. 

On macOS and Linux run: `source venv/bin/activate`

On Windows run: `venv\Scripts\activate.bat`

**You'll have to do this whenever you start working on your project with a new Terminal session.** You recognize that the environment is active if you see in your command line now `(venv)` at the beginning of the line. 

Every command you type in now is executed within the environment installed in that "venv" folder. That means also that you don't need to write `python3` anymore. Instead, you can just write `python` as the version of Python installed in your environment is at least the version 3. 

## .gitignore

While not strictly necessary, it's good practice to add a file called `.gitignore` to your repository and add the `venv` folder to it. This file contains a list of all the files and folders you don't want to add to a git repository (if you work with git - you should!).

Each line contains the name of either a file or folder that shouldn't be part of your repository. That's best practice to keep your repository clean and only include code files that are really necessary. 

## Installing package requirements

To install a package from pip, while you have the environment active just use `pip install`. For example, to install the Flask package just run:

```
pip install flask
```

All installed packages will show up in the "lib" folder inside the "venv" directory.

## requirements.txt

To keep track of the exact versions of your project's packages it's good practice to write them all in a file called **requirements.txt**. This way you have a list of packages and their versions in your project repository even if the `venv` folder is part of a `.gitignore` file.

To save a current list of all packages you have installed in a text file just write: 

```
pip freeze > requirements.txt
```

Do this every time you install a new package. This file will allow other develoeprs on your team to install the exact same versions of the same packages you have installed for your project using the following command: 

```
python -m pip install -r requirements.txt
```

This is also going to useful for you if you want to copy over your project to another computer or deploy your application to a server. 

## Deactivating the virtual environment

To deactivate the virtual environment simply type `deactivate` in your command line and hit the Enter key. 

Whenever you work on multiple projects at the same time, it can get quite confusing which environment is currently active. Keep that in mind and remember to always **activate** and **deactivate** environments when switching projects. If the comamnd line doesn't show "(venv)" it means, the environment isn't active. 