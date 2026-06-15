module "namespace" {

  source = "./modules/namespace"

  name = var.namespace
}
module "postgres" {

  source = "./modules/postgres"

  namespace = var.namespace

  username = var.postgres_username

  password = var.postgres_password

  depends_on = [
    module.namespace
  ]
}

module "kafka" {

  source = "./modules/kafka"

  namespace = var.namespace

  depends_on = [
    module.namespace
  ]
}

module "monitoring" {

  source = "./modules/monitoring"

  namespace = var.namespace

  depends_on = [
    module.namespace
  ]
}

module "network_policy" {

  source = "./modules/network-policy"

  namespace = var.namespace

  depends_on = [
    module.namespace
  ]
}

module "security" {
  source = "./modules/security"

  namespace = "default"
}

module "argocd_app" {
  source = "./modules/argocd-app"

  repo_url  = "https://github.com/ARPAN-007/Budget-app-prod.git"
  app_path  = "finops-chart"
  namespace = "default"
}