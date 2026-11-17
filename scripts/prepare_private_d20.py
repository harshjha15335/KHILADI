"""Prepare private serving data from the exact recovered accepted exports."""
import argparse
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "khiladi/backend"))
from analytics_import import prepare_bundle, write_bundle


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--step78-results", type=Path, required=True)
    parser.add_argument("--step9-results", type=Path, required=True)
    parser.add_argument("--canonical-csv", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True, help="Private directory OUTSIDE the checkout")
    args = parser.parse_args()
    try:
        bundle = prepare_bundle(args.step78_results, args.step9_results, args.canonical_csv)
        write_bundle(bundle, args.output)
    except (OSError, ValueError, KeyError) as exc:
        parser.exit(1, f"Private D20 preparation failed: {exc}\n")
    print(f"Verified private top20 bundle prepared: {bundle.metadata.model_id}")


if __name__ == "__main__":
    main()
