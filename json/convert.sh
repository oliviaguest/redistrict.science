for file in ./topo/*.topo.json
do
  rm "$file"
done


for file in ./geo/*.geo.json
do
  filename=$(basename "$file")
  extension="${filename##*.}"
  filename="${filename%.*.*}"
  mapshaper "$file" -simplify 5% -o topo/"$filename".topo.json format=topojson
done
