function getIns(sharedData) {
  let data, videoUrl, images;
  try {
    data = sharedData.entry_data.PostPage[0].graphql.shortcode_media;
  } catch (err) {
    console.log('数据错误', sharedData);
    throw Error('wrong data');
  }
  try {
    videoUrl = data.video_url;
  } catch (err) {
    console.log(err);
  };
  try {
    const children = data.edge_sidecar_to_children;
    const displayUrl = data.display_url;
    if (!children) {
      images = [displayUrl];  
    } else {
      images = data.edge_sidecar_to_children.edges.map(node => node.node.display_url);
    }
  } catch (err) {
    console.log(err);
  };
  if (!videoUrl && !images) {
    throw Error('wrong url');
    return null;
  }
  return {
    videoUrl,
    images
  }
  // if (videoUrl) {
  //   window.open(videoUrl, '_blank');
  // } else {
  //   let html = `
  //     <h1 style="text-align: center; font-size: 30px; margin: 30px;">Id: ${data.shortcode} | user name: ${data.owner.username} | full name: ${data.owner.full_name}</h1>
  //   `;
  //   html += images.map((img) => {
  //     return `
  //       <div style="margin: 30px auto; width: 800px;">
  //         <img src="${img}" style="width: 800px" />
  //       </div>
  //     `
  //   }).join('');
  //   document.body.innerHTML = html;
  // }
}

module.exports = getIns;