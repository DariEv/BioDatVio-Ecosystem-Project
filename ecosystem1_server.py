#Project ecosystem 1 by Daria Evseeva, Eduardo Vela, Nicolas Brich, Sarah Ertel, Constantin Holzapfel 21.1.19

#!flask/bin/python
from flask import Flask, render_template, request, redirect, url_for, abort, session
import os
import sys
import json
import random
import math
import csv
import pandas as pd
import numpy as np

from sklearn import preprocessing
from sklearn.decomposition import PCA
from collections import Counter


app = Flask(__name__)
app.config['DEBUG'] = True
app.config['SECRET_KEY'] = 'some_really_long_random_string_here'

#reads in tsv files and returns a dictionary for the subwebpages
def makeEcosystemDataset():
    data={}

    dataExploration=open('ecosystem_HITChiptsv.sec', newline='')
    data['dataExploration']=list(csv.DictReader(dataExploration, delimiter='\t'))
    dataExploration.close()

    metadataOverview=open('ecosystem_Metadatatsv.sec', newline='')
    data['metadataOverview']=list(csv.DictReader(metadataOverview, delimiter='\t'))
    metadataOverview.close()

    return data

#reads tsv files and calculates the PCoA matrix from it
def calculatePCoAFromData():
	data={}
	
	df = pd.read_csv("ecosystem_HITChiptsv.sec", sep="\t")
	
	# normalize data
	data_scaled = pd.DataFrame(preprocessing.scale(df.drop(['Unnamed: 0'], axis=1)), columns = df.drop(['Unnamed: 0'], axis=1).columns)
	
	# pcoa
	pca = PCA(n_components=2)
	XPCAreduced = pca.fit_transform(data_scaled)
	PCsPercentage = pca.explained_variance_ratio_
	
	# genrate output dataframe
	col_names = ["p1", "p2"]
	row_names = ["Sample-"+str(i+1) for i in range(len(XPCAreduced))]
	out = pd.DataFrame(XPCAreduced, index=row_names, columns=col_names).transpose()
	#out = pd.DataFrame(XPCAreduced, columns=col_names).transpose()
	
	data['dataExploration'] = out.to_dict()
	data['PCsPercentage'] = ["PC"+str(i+1)+", "+str(round(PCsPercentage[i]*100, 1))+"%"  for i in range(len(PCsPercentage))]
	
	
	### Features sorting ###
	pcaSort = PCA(n_components=50)
	
	# not normalized
	unnormalizedPCA = pcaSort.fit_transform(df.drop(['Unnamed: 0'], axis=1))
	weights = (pd.DataFrame(pcaSort.components_,columns=data_scaled.columns)).transpose()
	weights= np.absolute(weights)
	sort = pd.DataFrame.idxmax(weights).values
	s = ""
	for el in sort:
		s = s + str(list(data_scaled.columns.values).index(el)+1) +";"
	data['unnormalizedPCA'] = s
	
	# normalized
	normalizedPCA = pcaSort.fit_transform(data_scaled)
	weights = (pd.DataFrame(pcaSort.components_,columns=data_scaled.columns)).transpose()
	weights= np.absolute(weights)
	sort = pd.DataFrame.idxmax(weights).values
	s = ""
	for el in sort:
		s = s + str(list(data_scaled.columns.values).index(el)+1) +";"
	data['normalizedPCA'] = s
	
	
	### Metadata ### 
	metadataOverview=open('ecosystem_Metadatatsv.sec', newline='')
	data['metadataOverview']=list(csv.DictReader(metadataOverview, delimiter='\t'))
	metadataOverview.close()
	
	return data
	

@app.route('/')
def index():
    return redirect(url_for('project'))

@app.route('/dataExploration')
#renders dataExploration subwebpage
def dataExploration():
    return render_template('ecosystem1_dataExploration.html',
        data=json.dumps(makeEcosystemDataset()))
		
@app.route('/PCoA')
#renders PCoA subwebpage
def PCoA():
    return render_template('ecosystem1_PCoA.html',
        data=json.dumps(calculatePCoAFromData()))

@app.route('/metadataOverview')
#renders metadataOverview subwebpage
def metadataOverview():
    return render_template("ecosystem1_metadataOverview.html",
                           data=json.dumps(makeEcosystemDataset()))

@app.route('/project')
#renders metadataOverview subwebpage
def project():
    return render_template("ecosystem1_project.html")

if __name__ == '__main__':
    app.run(debug=True)
