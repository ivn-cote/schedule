import _ from "lodash";

const calcPositions = (boxes) => {
  boxes = _(boxes).sortBy('start').value();
  let collisionList = [];

  boxes.forEach((box, curInd) => {
    let collision = _(boxes)
      .map((x, ind) => _.assign(x, { ind }))
      .filter(other => (other.ind != curInd && _.max([ box.start, other.start ]) < _.min([ box.end, other.end ])))
      .pluck('ind').value();
    // console.log(box.ind, collision);
    collisionList.push(collision);
  });

  boxes.forEach((box, ind) => {
    let curCollList = [].concat(collisionList[ind]);
    if (box._set) return;

    let collisionFactor = curCollList.length;

    if (!collisionFactor) {
      box.disc = 1;
      box.col = 1;
      box._set = true;
      return;
    }
    if (collisionFactor == 1) {
      let collideBox = boxes[_.first(curCollList)];
      if (!collideBox._set) {
        collideBox.disc = 2;
        collideBox.col = 2;
        collideBox._set = true;
        box.col = 1;
        box.disc = 2;
      } else {
        box.disc = collideBox.disc;
        box.col = collideBox.col == 1 ? 2 : 1;
      }

      box._set = true;
      return;
    }

    let settedCollision = _.filter(curCollList, (boundBox) => {
      return boxes[boundBox]['_set'];
    });
    // console.log('settedCollision', ind, settedCollision);

    let multiplicator = settedCollision.length ? boxes[_.first(settedCollision)].disc : 1;
    // what boxes collide with current box
    let collisionBoxes = [ ind ].concat(settedCollision);
    curCollList = _.difference(curCollList, collisionBoxes);
    curCollList.forEach((boundBox) => {
      if (_.intersection(collisionBoxes, collisionList[boundBox]).length == collisionBoxes.length)
        collisionBoxes.push(boundBox);
    });

    collisionBoxes = _.difference(collisionBoxes, settedCollision);

    let collisionRange = collisionBoxes.length * multiplicator;

    // what columns are vacant after all collisions
    let settedCols = [];
    settedCollision.forEach(i => {
      let itCol = boxes[i].col;
      if (collisionRange == boxes[i].disc)
        settedCols.push(itCol);
      else {
        let scale = +(collisionRange / boxes[i].disc).toFixed();
        settedCols = settedCols.concat(_.range((itCol - 1) * scale + 1, itCol * scale + 1));
      }
    });

    let vacantCols = _.difference(_.range(1, collisionRange + 1), settedCols);
    // console.log('settedCols', settedCols);
    // console.log('vacantCols', vacantCols);
    // console.log('curCollList', curCollList);
    // console.log('collisionBoxes', collisionBoxes);

    collisionBoxes.forEach((boundBox, i) => {
      _.assign(boxes[boundBox], {
        disc: collisionRange,
        col: vacantCols[i],
        _set: true
      });
    });

  });
  // console.log('final boxes', boxes);
  return boxes;
};

export {calcPositions}
