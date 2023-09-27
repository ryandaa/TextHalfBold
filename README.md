 My Python Script

This script demonstrates how to use the `math` module to perform basic mathematical operations.

```python
import math

# This function calculates the area of a circle.
# Formula: Area = π * r^2
def circle_area(radius):
    return math.pi * math.pow(radius, 2)

# This function calculates the circumference of a circle.
# Formula: Circumference = 2 * π * r
def circle_circumference(radius):
    return 2 * math.pi * radius

# This function calculates the volume of a sphere.
# Formula: Volume = (4/3) * π * r^3
def sphere_volume(radius):
    return (4/3) * math.pi * math.pow(radius, 3)

# This function calculates the surface area of a sphere.
# Formula: Surface Area = 4 * π * r^2
def sphere_surface_area(radius):
    return 4 * math.pi * math.pow(radius, 2)

# Test the functions
r = 5
print(f"Circle with radius {r}:")
print(f"Area: {circle_area(r)}")
print(f"Circumference: {circle_circumference(r)}")
print(f"\nSphere with radius {r}:")
print(f"Volume: {sphere_volume(r)}")
print(f"Surface Area: {sphere_surface_area(r)}")
