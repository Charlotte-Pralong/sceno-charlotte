import * as THREE from 'three';

THREE.Object3D.prototype.getObjectsByTag = function (key, value, result = []) {

	// check the current object

	if (this.userData[key] === value) result.push(this);

	// check children

	for (var i = 0, l = this.children.length; i < l; i++) {

		var child = this.children[i];

		child.getObjectsByTag(key, value, result);

	}

	return result;

};