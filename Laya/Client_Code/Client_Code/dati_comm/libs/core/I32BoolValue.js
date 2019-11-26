///32位整数存储状态位包装

class I32BoolValue {
  constructor(v) {
    this.I32Value = v>>>0
  }


  SetBool(pos, v)
  {
    var mask = this.pos2mask(pos);
    if (v)
      this.I32Value |= mask;
    else
      this.I32Value &= ~mask;
  }

  GetBool(pos)
  {
    return (this.I32Value & this.pos2mask(pos)) > 0;
  }

  pos2mask(pos)
  {
    return (1>>>0) << pos
  }
}


export { I32BoolValue }