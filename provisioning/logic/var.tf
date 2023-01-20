## Vars
variable "location_name" {
  description = "Location name"
  default     = "East US"
  type        = string
}

variable "node_count" {
  description = "Node count"
  default = 1
  type = number
}
