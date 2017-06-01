for file in ./topo/*.topo.json
do
  rm "$file"
done


for file in ./geo/*.geo.json
do
  filename=$(basename "$file")
  extension="${filename##*.}"
  filename="${filename%.*.*}"
  state=${filename:0:2}
  echo "$state"
  mapshaper "$file" -simplify 5% -o topo/"$state".topo.json format=topojson
done
