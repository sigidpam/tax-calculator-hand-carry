# We skip the "Node" stage entirely to save RAM on the VM
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy your locally built 'dist' folder directly
COPY ./dist /usr/share/nginx/html
EXPOSE 8084
CMD ["nginx", "-g", "daemon off;"]
