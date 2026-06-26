from flask import Blueprint, jsonify, request

from models import Gavekort, db


kjøp_bp = Blueprint("kjøp_bp", __name__)


@kjøp_bp.route("/gavekort", methods=["POST"])
def lag_gavekort():
	data = request.get_json()
	if not data or "belop" not in data:
		return jsonify({"error": "belop mangler"}), 400

	belop = data["belop"]

	if not isinstance(belop, int) or belop <= 0:
		return jsonify({"error": "belop må være et positivt tall"}), 400

	gavekort = Gavekort(belop=belop, brukt=0, igjen=belop)
	db.session.add(gavekort)
	db.session.commit()

	return jsonify({
		"id": gavekort.id,
		"belop": gavekort.belop,
		"brukt": gavekort.brukt,
		"igjen": gavekort.igjen
	}), 201
