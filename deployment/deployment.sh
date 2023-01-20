#!/bin/sh
allOK = true

echo "------------------> Deploying Covachapp" $(date) "\n"

echo "Connecting to cluster...\n"
az aks get-credentials --resource-group covachapp-eastus-rg --name covachapp-aks

status=$?
echo $status

if [ $status -eq 0 ]; 
then
	echo "Creating secrects...\n"

	kubectl apply -f ./secrects

	echo "Creating volumes...\n"

	kubectl apply -f ./volumesAzure

	echo "Creating services...\n"

	read -p 'docker-registry: ' registry
	read -p 'docker-server: ' server
	read -p 'docker-username: ' username
	read -s -p 'docker-password: ' password
	read -p "Password: " password
	read -p 'docker-email: ' email

	echo
	kubectl create secret docker-registry $registry --docker-server=$server --docker-username=$username --docker-password=$password --docker-email=$email
	echo

	echo "Creating dbs...\n"

	helm install auth-db --values ./launchs/auth_db.yml  ./postgres-db 
	helm install products-db --values ./launchs/products_db.yml  ./postgres-db 
	helm install search-db --values ./launchs/search_db.yml  ./mongo-db 

	echo "Creating backend services...\n"

	helm install auth-service --values ./launchs/auth_service.yml  ./python-app 
	helm install products-service --values ./launchs/products_service.yml  ./python-app 

	helm install search-consumer --values ./launchs/search_consumer.yml ./go-app
	helm install search-service --values ./launchs/search_service.yml ./go-app

	echo "Creating frontend services...\n"

	helm install frontend --values ./launchs/frontend_service.yml ./next-app

	#helm install ingress-nginx ingress-nginx/ingress-nginx \
	#  --set controller.service.annotations."service\.beta\.kubernetes\.io/azure-load-balancer-health-probe-request-path"=/

	echo "Creating monitoring...\n"

	kubectl apply --server-side -f monitoring/manifests/setup
	kubectl wait \
		--for condition=Established \
		--all CustomResourceDefinition \
		--namespace=monitoring
	kubectl apply -f monitoring/manifests/

	echo "Creating CI/CD services...\n"

	kubectl apply -f jenkins/ns-jenkins.yml
	kubectl apply -f jenkins/pvc-jenkins.yml

	helm repo add jenkins https://charts.jenkins.io
    helm repo update
    helm install jenkins --namespace jenkins --values jenkins/values.yml  jenkins/jenkins 

else
 echo "Fail to connect to the cluster"
fi

# helm install <service_name> --values ./launchs/auth_db.yml  ./postgres_db 

#kubectl create secret docker-registry covapp 
# --docker-server covapp.azurecr.io --docker-username covapp 
# --docker-password 3162823639Mio. --docker-email c74dcb48-3455-40ae-8ad9-47fe3d48aa4d

#kubectl create secret docker-registry regcred --docker-server=<your-registry-server> --docker-username=<clientId> --docker-password=<your-pword> --docker-email=<your-email>


