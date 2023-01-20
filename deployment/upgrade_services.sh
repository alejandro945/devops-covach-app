helm upgrade auth-service --values ./launchs/auth_service.yml  ./python-app 
helm upgrade products-service --values ./launchs/products_service.yml  ./python-app 

helm upgrade search-consumer --values ./launchs/search_consumer.yml ./go-app
helm upgrade search-service --values ./launchs/search_service.yml ./go-app

helm upgrade frontend --values ./launchs/frontend_service.yml ./next-app