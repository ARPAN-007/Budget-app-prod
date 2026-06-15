resource "helm_release" "postgres" {

  name       = "postgres"

  repository = "https://charts.bitnami.com/bitnami"

  chart      = "postgresql"

  namespace  = var.namespace

  set {
    name  = "auth.username"
    value = var.username
  }

  set {
    name  = "auth.password"
    value = var.password
  }

  set {
    name  = "auth.database"
    value = "finops"
  }
}