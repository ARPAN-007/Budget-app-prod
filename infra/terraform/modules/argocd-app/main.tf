resource "kubectl_manifest" "argocd_app" {

  yaml_body = <<YAML
apiVersion: argoproj.io/v1alpha1
kind: Application

metadata:
  name: budget-ai
  namespace: argocd

spec:
  project: default

  source:
    repoURL: ${var.repo_url}
    targetRevision: master
    path: ${var.app_path}

  destination:
    server: https://kubernetes.default.svc
    namespace: ${var.namespace}

  syncPolicy:
    automated:
      prune: true
      selfHeal: true
YAML
}