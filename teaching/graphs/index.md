---
published: false
layout: default
title: Graphs
parent: Teaching
has_children: true
has_toc: false
nav_order: 2
permalink: /teaching/graphs/
---

# Graphs

Choose a resource to explore the simulation and its mathematical background.

{% assign resources = site.pages | where: "parent", page.title | where: "grand_parent", page.parent | sort: "nav_order" %}
{% for resource in resources %}
- [{{ resource.title }}]({{ resource.url | relative_url }})
{% endfor %}
