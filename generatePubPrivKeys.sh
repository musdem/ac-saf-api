#!/bin/bash

openssl genrsa -out saf 2048
openssl rsa -in saf -pubout -out saf.pub
