"""Plot each state's districts and clusters from the respective GeoJSONs."""

import os
import us
import geopandas as gpd
import matplotlib.pyplot as plt

cmap = 'YlGnBu'
json_directory = '../json/geo/'
clusters_png_directory = '../images/best_plots/'
districts_png_directory = '../images/congressional_district_plots/'

# First do the clusters:
for i, filename in enumerate(os.listdir(json_directory)):
    if filename.endswith(".geo.json"):
        # print(os.path.join(directory, filename))
        #         fname = "../json/geo/AL_2017_05_12_18_47_09.geo.json"

        df = gpd.read_file(json_directory + filename)
        print(i, filename)
        ax = df.plot(edgecolor='white',  linewidth=0, cmap=cmap)
        ax.set_axis_off()
        plt.savefig(clusters_png_directory + filename[:2] + '.png',
                    bbox_inches="tight", pad_inches=0, # transparent=True,
                    dpi=600)
        # os.system('pdfcrop %s %s &> /dev/null &'%('AL.pdf', 'AL.pdf'))
        os.system('convert -trim %s %s &> /dev/null &' %
                  (clusters_png_directory + filename[:2] + '.png',
                   clusters_png_directory + filename[:2] + '.png'))
        plt.close()


def get_state(geoid):
    """Extract state ID from GEOID."""
    return geoid[:2]


# Then do the real districts:
fname = "../json/geo/USA.geo.json"
df = gpd.read_file(fname)
df['state'] = df['GEOID'].apply(get_state)
df = df.sort_values(by='state')
for i, fips in enumerate(df.state.unique()):
    state_df = df[df['state'] == fips]
    filename = us.states.lookup(fips).abbr
    print(i, filename)
    ax = state_df.plot(edgecolor='white',  linewidth=0, cmap=cmap)
    ax.set_axis_off()
    plt.savefig(districts_png_directory + filename + '.png',
                bbox_inches="tight", pad_inches=0, # transparent=True,
                dpi=600)

    # os.system('pdfcrop %s %s &> /dev/null &'%('AL.pdf', 'AL.pdf'))
    os.system('convert -trim %s %s &> /dev/null &' %
              (districts_png_directory + filename + '.png',
               districts_png_directory + filename + '.png'))
    plt.close()
