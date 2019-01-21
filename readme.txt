# BioDatVio-Ecosystem-Project
This application is running on python 3.7.2 and uses following packages: flask 1.0.2, pandas 0.23.4, numpy1.15.3, sklearn 0.20.2.

This project consists of 4 subwebpages: the project-, the profile exploration-, the metadata overview and PCoA webpage.

The project webpage is a short description of the project and the data.

The profile exploration webpage features a heatmap colored by relative abundance of taxa (log10) that can be filtered by metadata.
Columns can also be filtered and rearranged using the described string form in the filter.

The metadata overview shows pie charts and histograms representing the metadata of our data set. The data can also be filtered by metadata to see how the other metadata changes.

The PCoA webpage represents plot of first two principal components. Data points of different metadata tags can be sorted by colors using the sort button. The normal filter functionality also applies for metadata.
It also reports normalized and non-normalized most weighted taxa in form of column filter string form and can be used in the column filter on the profile exploration webpage.

In order to start the application follow these steps:

1. Open console
2. CD into the directory
3. Start a local webserver within the directory: "python ecosystem1_server.py"
4. open a webbrowser and direct to "localhost:5000"
5. Enjoy the webpage