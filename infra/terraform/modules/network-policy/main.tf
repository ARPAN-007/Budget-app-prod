resource "kubernetes_network_policy" "default" {

  metadata {
    name      = "finops-policy"
    namespace = var.namespace
  }

  spec {
    pod_selector {}

    policy_types = [
      "Ingress",
      "Egress"
    ]
  }
}