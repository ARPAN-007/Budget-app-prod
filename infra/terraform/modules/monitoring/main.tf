resource "helm_release" "monitoring" {

  name       = "monitoring"

  repository = "https://prometheus-community.github.io/helm-charts"

  chart      = "kube-prometheus-stack"

  namespace  = var.namespace
}