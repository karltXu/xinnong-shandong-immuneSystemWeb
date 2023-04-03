FROM nginx
WORKDIR /mnt/deploy
COPY dist/ pages
COPY config/nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /etc/nginx/conf.d/*
COPY config/page.conf /etc/nginx/conf.d/page.conf
#定义时区参数
ENV TZ=Asia/Shanghai

#设置时区
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo '$TZ' > /etc/timezone
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]
