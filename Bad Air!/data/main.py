import os
import glob
import pandas as pd
os.chdir("C:/Users/brian/Documents/2021-2022/Spring 2022/Data Visualization/d3-starter-template-master/data")

extension = 'csv'
all_filenames = [i for i in glob.glob('*.{}'.format(extension))]
#combine all files in the list
combined_csv = pd.concat([pd.read_csv(f) for f in all_filenames ])
#export to csv
combined_csv.to_csv( "AQI.csv", index=False, encoding='utf-8-sig')