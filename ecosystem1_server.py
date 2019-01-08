#Project ecosystem 1 by Daria Evseeva, Eduardo Vela, Nicolas Brich, Sarah Ertel, Constantin Holzapfel  

#!flask/bin/python
from flask import Flask, render_template, request, redirect, url_for, abort, session
import os
import sys
import json
import random
import math
import csv

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

@app.route('/')
def index():
    return redirect(url_for('dataExploration'))

@app.route('/dataExploration')
#renders dataExploration subwebpage
def dataExploration():
    return render_template('ecosystem1_dataExploration.html', 
        data=json.dumps(makeEcosystemDataset()))

@app.route('/metadataOverview')
#renders metadataOverview subwebpage
def metadataOverview(): 
    return render_template('ecosystem1_metadataOverview.html', 
        data=json.dumps(makeEcosystemDataset()))


if __name__ == '__main__':
    app.run(debug=True)
