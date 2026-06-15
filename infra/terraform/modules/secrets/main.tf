resource "kubernetes_secret" "postgres" {

  metadata {
    name      = "postgres-secret"
    namespace = var.namespace
  }

  data = {
    username = base64encode(var.username)
    password = base64encode(var.password)
  }

  type = "Opaque"
}