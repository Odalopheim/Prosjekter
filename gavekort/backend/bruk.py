from flask import Blueprint, jsonify, request

from models import Gavekort, db


bruk_bp = Blueprint("bruk_bp", __name__)


@bruk_bp.route("/gavekort/<int:id>/bruk", methods=["POST"])
def bruk_gavekort(id):
	gavekort = Gavekort.query.get_or_404(id)
	data = request.get_json()

	if not data or "belop" not in data:
		return jsonify({"error": "belop mangler"}), 400

	belop = data["belop"]

	if not isinstance(belop, int) or belop <= 0:
		return jsonify({"error": "belop må være et positivt tall"}), 400

	if belop > gavekort.igjen:
		mangler = belop - gavekort.igjen
		return jsonify({
			"error": f"Du mangler {mangler} kroner og har {gavekort.igjen} kroner på kortet.",
			"har": gavekort.igjen,
			"mangler": mangler
		}), 400

	gavekort.brukt += belop
	gavekort.igjen -= belop
	db.session.commit()

	return jsonify({
		"id": gavekort.id,
		"belop": gavekort.belop,
		"brukt": gavekort.brukt,
		"igjen": gavekort.igjen
	})
