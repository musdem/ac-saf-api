#!/bin/bash

openssl genrsa -out atx 2048
openssl rsa -in atx -pubout>>atx.pub