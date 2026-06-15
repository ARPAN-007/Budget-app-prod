output "secret_name" {
  value = kubernetes_secret.postgres.metadata[0].name
}