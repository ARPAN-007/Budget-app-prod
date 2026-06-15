output "network_policy_name" {
  value = kubernetes_network_policy.default.metadata[0].name
}