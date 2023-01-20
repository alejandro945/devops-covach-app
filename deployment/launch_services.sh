helm install auth-service --values ./launchs/auth_service.yml  ./python-app 
helm install products-service --values ./launchs/products_service.yml  ./python-app 

helm install search-consumer --values ./launchs/search_consumer.yml ./go-app
helm install search-service --values ./launchs/search_service.yml ./go-app

helm install frontend --values ./launchs/frontend_service.yml ./next-app