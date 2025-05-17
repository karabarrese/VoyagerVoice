# importing the module
import wikipedia

# wikipedia page object is created
page_object = wikipedia.page("india")

# printing html of page_object
print(page_object.html)

# printing title
print(page_object.original_title)

# printing links on that page object
print(page_object.links[0:10])