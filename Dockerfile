FROM nginx:stable-perl

USER root

WORKDIR /etc/nginx

RUN mkdir sites-available
RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/
COPY Script/* /etc/nginx/sites-available/SimpleCalculator/Script/
COPY Style/* /etc/nginx/sites-available/SimpleCalculator/Style/
COPY SimpleCalc.html /etc/nginx/sites-available/SimpleCalculator/

EXPOSE 80